class StaticController < ApplicationController
  def postcard
    @postcard_id = params[:view]
    render :postcard, :layout => false
  end
end